
export interface IProfile {
  name: string;
  email?: string;
  profileImage?: string;
}

export interface IProfile_InitialState {
  profile: IProfile;
}


export interface IUpdateProfileName extends IProfile {}
