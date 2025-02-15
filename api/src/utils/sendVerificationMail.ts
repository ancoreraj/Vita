import { Response } from 'express';
import { CLIENT_URL } from '../config/keys';
import { sendEmail } from '../service/email-service';
import { makeTemplate } from '../templates';
import { UserSchemaType } from '../types';

const sendVerificationMail = async (res: Response, user: UserSchemaType) => {
  const verificationToken = user.createVerificationToken();
  const verificationUrl = `${CLIENT_URL}/email-verification?token=${verificationToken}`;

  try {
    const emailId = await sendEmail(
      user.email,
      'Verify your email',
      makeTemplate('emailVerification.hbs', {
        url: verificationUrl,
        name: user.first_name,
      }),
    );

    return res.status(200).json({
      success: true,
      emailId,
    });
  } catch (err) {
    return res.status(400).json({
      error: {
        email: 'Invalid email address',
      },
    });
  }
};

export default sendVerificationMail;
