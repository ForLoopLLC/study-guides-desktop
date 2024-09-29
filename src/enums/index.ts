export enum ParserType {
  Colleges,
  Certifications,
}

export enum ParserOperationMode {
  PreParse = 'PreParse',
  Parse = 'Parse',
}

export enum QuestionFilterType {
  All = 'All',
  Reported = 'Reported',
  MissingLearnMore = 'MissingLearnMore',
  MissingDistractors = 'MissingDistractors',
}

export enum UserFilterType {
  All = 'All',
  Admin = 'Admin',
  User = 'User',
  Tester = 'Tester',
  Freelancer = 'Freelancer',
}
