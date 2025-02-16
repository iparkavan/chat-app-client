type CheckUserTypes = {
  msg: string;
  status: boolean;
};

type UserInfoTypes =
  | {
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      profileImage: string | null;
      profileSetup: boolean;
      id: string | null;
      bgColor: number | null;
    }
  | undefined;

export type { CheckUserTypes, UserInfoTypes };
