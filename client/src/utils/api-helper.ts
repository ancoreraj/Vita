import axios from 'axios';
import { SERVER_URL } from 'config.keys';
import { FieldValues } from 'react-hook-form';
import { MentorSchemaType } from 'types';

export interface GetMentorsResponse {
  mentors: MentorSchemaType[];
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
}

export const getMentors = async (
  expertise = 'All',
  topic = -1,
  page = 1,
  limit = 0,
) => {
  const { data: response } = await axios.get<GetMentorsResponse>(
    `${SERVER_URL}/api/get-mentors`,
    {
      params: {
        expertise,
        topic,
        page,
        limit,
      },
    },
  );

  return response;
};

export const getTopMentors = async () => {
  const { data: response } = await axios.get<MentorSchemaType[]>(
    `${SERVER_URL}/api/top-mentors`,
  );

  return response;
};

export const convertToFormData = (data: FieldValues) => {
  const form = new FormData();

  Object.keys(data).forEach((key) => {
    if (typeof data[key] !== 'string' && !(data[key] instanceof File)) {
      form.append(key, JSON.stringify(data[key]));
    } else {
      form.append(key, data[key]);
    }
  });

  return form;
};
