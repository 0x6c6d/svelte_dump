import type { Actions, PageServerLoad } from './$types.js';
import { requestSignInOTP, verifyOTP } from '$lib/pocketbase/auth.js';
import type { OTPResponse } from 'pocketbase';

import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { schemaOtpMail, schemaOtpNumber } from '$lib/common/schemas/otpSchema.js';

let otpResponse : OTPResponse

export const load: PageServerLoad = async () => {
    // Different schemas, no id required.
    const mailForm = await superValidate(zod(schemaOtpMail));
    const otpForm = await superValidate(zod(schemaOtpNumber));
  
    return { mailForm, otpForm };
  };

export const actions = {
    mail: async ({ request }) => {
        const mailForm = await superValidate(request, zod(schemaOtpMail));
        
        if (!mailForm.valid){
            return fail(400, { mailForm });
        } 
            
        
        const result = await requestSignInOTP(mailForm.data.email);
        if(!result.success){
            return fail(505, { mailForm })
        } 
        
        // TODO: this doesnt work: use SvelteKit Session Storage instead
        otpResponse = result.data!;
        return {
            mailForm,
            message: 'Mail form submitted'
        }
    },
  
    otp: async ({ request }) => {
      const otpForm = await superValidate(request, zod(schemaOtpNumber));
  
      if (!otpForm.valid) {
          return fail(400, { otpForm });
      }
      
      const result = await verifyOTP(otpResponse, otpForm.data.otp);
      return message(otpForm, 'OTP form submitted');
    }
  } satisfies Actions;
