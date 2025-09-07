
export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  sender: Sender;
  text: string;
}

export enum CVSection {
  WELCOME,
  PERSONAL_DATA,
  CAREER_GOAL,
  EDUCATION,
  EXPERIENCE,
  SKILLS,
  INTERESTS,
  GENERATING,
  FINISHED,
}
