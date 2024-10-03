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

export enum Routes {
  Root = '/',
  Colleges = '/colleges',
  Certifications = '/certifications',
  Tags = '/tags',
  Questions = '/questions',
  Users = '/users',
}

export enum Channels {
  // Navigation
  Navigate = 'navigate',
  Connection = 'connection',
  EnvUpdate = 'env-update',

  // Logs
  LogMessage = 'log:message',
  LogUpdate = 'log:update',
  StartTailLog = 'log:start-tail',
  StopTailLog = 'log:stop-tail',

  // Tags
  GetTags = 'tags:get',
  GetTagWithRelations = 'tags:get-with-relations',
  UpdateTags = 'tags:update',
  UpdateTag = 'tags:update-single',
  DeleteTag = 'tags:delete',
  ClearTagReports = 'tags:clear-reports',

  // Users
  GetUsers = 'users:get',
  UpdateUser = 'users:update',

  // Questions
  GetQuestion = 'questions:get-single',
  GetQuestions = 'questions:get',
  UpdateQuestions = 'questions:update',
  UpdateQuestion = 'questions:update-single',
  ClearQuestionReports = 'questions:clear-reports',

  // Publish Tags Index
  PublishTagsIndex = 'tags:publish-index',
  PublishTagsIndexProgress = 'tags:publish-index-progress',
  PublishTagsIndexComplete = 'tags:publish-index-complete',
  PublishTagsIndexError = 'tags:publish-index-error',

  // Batch Assist Tags
  BatchAssistTags = 'tags:batch-assist',
  BatchAssistTagsProgress = 'tags:batch-assist-progress',
  BatchAssistTagsComplete = 'tags:batch-assist-complete',
  BatchAssistTagsError = 'tags:batch-assist-error',

  // Batch Assist Questions
  BatchAssistQuestions = 'questions:batch-assist',
  BatchAssistQuestionsProgress = 'questions:batch-assist-progress',
  BatchAssistQuestionsComplete = 'questions:batch-assist-complete',
  BatchAssistQuestionsError = 'questions:batch-assist-error',

  // Publish Users Index
  PublishUsersIndex = 'users:publish-index',
  PublishUsersIndexProgress = 'users:publish-index-progress',
  PublishUsersIndexComplete = 'users:publish-index-complete',
  PublishUsersIndexError = 'users:publish-index-error',

  // Publish Questions Index
  PublishQuestionsIndex = 'questions:publish-index',
  PublishQuestionsIndexProgress = 'questions:publish-index-progress',
  PublishQuestionsIndexComplete = 'questions:publish-index-complete',
  PublishQuestionsIndexError = 'questions:publish-index-error',

  // Import Files
  ImportFile = 'files:import',
  ImportFeedback = 'files:import-feedback',

  // Delete Files
  DeleteFile = 'files:delete',
  DeleteFileFeedback = 'files:delete-feedback',
  DeleteFolder = 'folder:delete',
  DeleteFolderFeedback = 'folder:delete-feedback',

  // List Files
  ListFiles = 'files:list',
  ListFilesFeedback = 'files:list-feedback',

  // List Folders
  ListFolders = 'folders:list',
  ListFoldersFeedback = 'folders:list-feedback',

  // Parse Files
  ParseFolder = 'folder:parse',
  ParseFolderFeedback = 'folder:parse-feedback',

  // Assist
  AssistTag = 'tags:assist',
  AssistQuestion = 'questions:assist',
  AssistFolder = 'folder:assist',
  AssistFeedback = 'folder:assist-feedback',
  AssistProgress = 'folder:assist-progress',

  // Export files
  ExportFolder = 'folder:export',
  ExportFolderFeedback = 'folder:export-feedback',
  ExportFolderProgress = 'folder:export-progress',
}
