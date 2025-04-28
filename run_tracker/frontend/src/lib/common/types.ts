export type CreateRunInput = {
  userId: string;
  date: Date;
  distance: number;
  comment: string;
};

export type Run = CreateRunInput & {
  id: string;
};
