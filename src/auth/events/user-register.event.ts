export class UserRegisterEvent {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly verificationToken: string,
  ) {}
}
