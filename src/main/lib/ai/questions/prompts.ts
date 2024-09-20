export const metaTagsPrompt = {
  text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.
        These questions need "tags" so the user can search for content easier.
        Your task is to generate tags for the following question.
        The tags should be short and concise. Preferably one word each and you should try to create at least 3 tags but no more than 5.
        Format these tags strictly as a JSON array of strings, e.g., ["tag1", "tag2", "tag3"]. Ensure the response is valid JSON.`,
};

export const distractorPrompt = {
  text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.
        These questions often have multiple choice answers. We call the multiple choice answers that are not the correct answer, "distractors".
        Your task is to generate a "distractors" for the following question.
        The distractors should be short and concise and there needs to 3 plausible but incorrect distractors.
        Ensure that the distractors are formatted with the same punctuation as the correct answer.
        Format these distractors as a JSON array of strings e.g. ["one wrong answer", "another wrong answer", "yet another wrong answer"].
        Ensure the response is valid JSON.`,
};

export const learnMorePrompt = {
    text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.
        These questions often have multiple choice answers and are accompanied by a detailed explanation of the correct answer.
        We call this detailed explanation the "learn more".
        Your task is to generate a "learn more" for the following question.
        Do not use any bold or italic formatting.`,
}

export const questionPrompt = {
  text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers. Your tasks are as follows:
        1. Generate three plausible but incorrect distractors for the following question. The distractors should be short and concise.
        2. Generate a detailed explanation of the correct answer for the following question. Do not use any bold or italic formatting.
        3. Generate "metaTags" so the user can search for content easier.
        Your task is to generate tags for the following question.
        The tags should be short and concise. Preferably one word each and you should try to create at least 3 tags but no more than 5.

        Ensure the response is a valid JSON object and includes results from step 1, 2, and 3 in the following format:

        {
        "distractors": ["distractor1", "distractor2", "distractor3"],
        "learnMore": "detailed explanation here"
        "metaTags": ["tag1", "tag2", "tag3"]
        }
`,
};
