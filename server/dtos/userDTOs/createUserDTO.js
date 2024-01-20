class CreateUserDto {
  constructor(fullName, username, email, password, preferredLanguage, birthDate) {
    this.fullName = fullName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.preferredLanguage = preferredLanguage;
    this.birthDate = birthDate;
  }
}

module.exports = CreateUserDto;