export const metaTagsPrompt = {
  text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.
        These questions need "tags" so the user can search for content easier.
        Your task is to generate tags for the following question.
        The tags should be short and concise. Preferably one word each and you should try to create at least 3 tags but no more than 5.
        Ensure that the output is valid JSON, with all keys and values properly quoted and formatted in the following format:

        {
                "metaTags":  ["tag1", "tag2", "tag3"],
        }
                
        All special characters, such as backslashes used in LaTeX expressions, should be escaped properly (i.e., use \\ for backslashes)`,
};

export const distractorPrompt = {
  text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.
        These questions often have multiple choice answers. We call the multiple choice answers that are not the correct answer, "distractors".
        Your task is to generate a "distractors" for the following question.
        The distractors should be short and concise and there needs to 3 plausible but incorrect distractors.
        The distractors MUST not end with any punctuation.

        Ensure that the output is valid JSON, with all keys and values properly quoted and formatted in the following format:

        {
                "distractors":  ["one wrong answer", "another wrong answer", "yet another wrong answer"],
        }
                
        All special characters, such as backslashes used in LaTeX expressions, should be escaped properly (i.e., use \\ for backslashes)`,
};

export const learnMorePrompt = {
  text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.
        These questions often have multiple choice answers and are accompanied by a detailed explanation of the correct answer.
        We call this detailed explanation the "learn more".
        Your task is to generate a "learn more" for the following question.
        Do not use any bold or italic formatting.
        
        Ensure that the output is valid JSON, with all keys and values properly quoted and formatted in the following format:

        {
                "learnMore": "detailed explanation here"
        }
                
        All special characters, such as backslashes used in LaTeX expressions, should be escaped properly (i.e., use \\ for backslashes)`,
};

export const questionPrompt = {
  text: `
        You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers.

        Your tasks are as follows:

        Generate three plausible but incorrect distractors for the following question. The distractors should be short and concise and MUST not end with any punctuation.
        Generate a detailed explanation of the correct answer for the following question.

        Important requirements:
        - **ALL LaTeX expressions MUST be enclosed in "<latex> ... </latex>" tags.** Do not use "\(\)" or "\[\]" to wrap LaTeX expressions. Only use the "<latex>" tags for LaTeX expressions.
        - Ensure that the output is formatted as plain text and follows the structure below.
        - Make sure the distractors are separated clearly, without any punctuation at the end.
        - Include a detailed explanation for why the correct answer is right.
        - Do NOT cut off sentences or expressions mid-way.

        If the LaTeX expression appears inside distractors or LearnMore, use <latex> ... </latex>.

        Output Format:
        Distractors:
        - distractor1
        - distractor2
        - distractor3

        LearnMore:
        Explanation of why the correct answer is right.

        Output Example:
        Distractors:
        - The electron orbit is <latex>\frac{a}{b}</latex> and stable due to constant speed
        - The electron emits radiation while orbiting the nucleus
        - The energy levels are continuous and not quantized

        LearnMore:
        In the Bohr model of the hydrogen atom <latex>\frac{13.6}{n^2}</latex>, the energy levels of the electron are quantized, meaning that the electron can only exist in specific orbits with fixed energies.
`,
}
