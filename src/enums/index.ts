export enum ParserType {
  Colleges,
  Certifications,
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

export enum Channels {
  Navigate = 'navigate',
  Connection = 'connection',
  EnvUpdate = 'env-update',
  // logs
  LogMessage = 'log-message',
  LogUpdate = 'log-update',
  StartTailLog = 'start-tail-log',
  StopTailLog = 'stop-tail-log',
  // tags
  GetTags = 'get-tags',
  GetTagWithRelations = 'get-tag-with-relations',
  UpdateTags = 'update-tags',
  UpdateTag = 'update-tag',
  DeleteTag = 'delete-tag',
  ClearTagReports = 'clear-tag-reports',
  GetTagAssist = 'get-ai-tag',
  // users
  GetUsers = 'get-users',
  UpdateUser = 'update-user',
  // questions
  GetQuestion = 'get-question',
  GetQuestions = 'get-questions',
  UpdateQuestions = 'update-questions',
  UpdateQuestion = 'update-question',
  ClearQuestionReports = 'clear-question-reports',
  // assist questions
  AssistQuestion = 'get-ai-question',
  // publish tags index
  PublishTagsIndex = 'publish-tags-index',
  PublishTagsIndexProgress = 'publish-tags-index-progress',
  PublishTagsIndexComplete = 'publish-tags-index-complete',
  PublishTagsIndexError = 'publish-tags-index-error',
  // batch assist tags
  BatchAssistTags = 'batch-assist-tags',
  BatchAssistTagsProgress = 'batch-assist-tags-progress',
  BatchAssistTagsComplete = 'batch-assist-tags-complete',
  BatchAssistTagsError = 'batch-assist-tags-error',
  // batch assist questions
  BatchAssistQuestions = 'batch-assist-questions',
  BatchAssistQuestionsProgress = 'batch-assist-questions-progress',
  BatchAssistQuestionsComplete = 'batch-assist-questions-complete',
  BatchAssistQuestionsError = 'batch-assist-questions-error',
  // publish users index
  PublishUsersIndex = 'publish-users-index',
  PublishUsersIndexProgress = 'publish-users-index-progress',
  PublishUsersIndexComplete = 'publish-users-index-complete',
  PublishUsersIndexError = 'publish-users-index-error',
  // publish questions index
  PublishQuestionsIndex = 'publish-questions-index',
  PublishQuestionsIndexProgress = 'publish-questions-index-progress',
  PublishQuestionsIndexComplete = 'publish-questions-index-complete',
  PublishQuestionsIndexError = 'publish-questions-index-error',
  // import files
  ImportFile = 'import-file-to-local',
  ImportFeedback = 'file-import-feedback',
  // delete files
  DeleteFile = 'import-delete-file',
  DeleteFileFeedback = 'file-delete-feedback',
  DeleteFolder = 'import-delete-folder',
  DeleteFolderFeedback = 'folder-delete-feedback',
  // list files
  ListFiles = 'import-list-files',
  ListFilesFeedback = 'file-list-feedback',
  // parse files
  ParseFile = 'import-parse-file',
  ParseFileFeedback = 'file-parse-feedback',
  ParseFolder = 'import-parse-folder',
  ParseFolderFeedback = 'folder-parse-feedback',
  // assist files
  AssistFolder = 'import-assist-folder',
  AssistFeedback = 'folder-assist-feedback',
  AssistProgress = 'folder-assist-progress',
}

