import { Moment } from 'moment-timezone';
import React from 'react';

export interface AppbarProps {
  window?: () => Window;
  children: React.ReactElement;
}

export interface OptionType {
  label: string;
  value: number;
}

export interface Topic {
  value: number;
  topicName: string;
  motivation: MotivationEnumType;
  description: string;
  emojiIcon: string;
  emojiBadge: string;
}

export type DayEnumType = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface ExperienceType {
  id: string;
  company: string;
  role: string;
  start_year?: string;
  end_year?: string;
}

export interface MentorSchemaType {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: {
    url: string;
    filename: string;
  };
  experiences: ExperienceType[];
  bio: string;
  expertise: string[];
  languages: string[];
  linkedIn: string;
  is_mentoring: boolean;
  topics: number[];
  time_slots: SlotType[];
}

export type MotivationEnumType =
  | 'Job Search'
  | 'Career Advice'
  | 'Mentorship'
  | 'Leadership'
  | 'Skills';

export interface SlotType {
  start: Date | null;
  end: Date | null;
  available?: boolean;
}

export interface DurationType {
  start: Moment;
  end: Moment;
  available?: boolean;
}

export type AvailabilitySlots = {
  [key: string]: {
    checked: boolean;
    label: string;
    value: SlotType;
  }[];
};

export type VerificationResponseType = {
  success: boolean;
  isLoggedIn?: boolean;
  message?: string;
};

export type UserType = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  verified: boolean;
  signup_completed: boolean;
  is_mentor: boolean;
  avatar?: {
    url?: string;
    filename?: string;
  };
};

export interface BookingType {
  session: Session;
  _id: string;
  mentee_email: string;
  mentor_email: string;
  start_date: Date;
  end_date: Date;
  status: string;
  __v: number;
  event_id: string;
  google_meeting_link: string;
  mentee: User;
  mentor: User;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
}

export interface Session {
  email: string;
  topic: string;
  description: string;
}
