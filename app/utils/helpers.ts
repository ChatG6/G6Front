import axios from "axios";


export const stripHtmlTags = (html: string): string => {
	const tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
};

export const paraphrase = async (userText: string) => {
	const text = stripHtmlTags(userText);
	console.log(userText)
	if (text !== "") {
		const { data } = await axios.post("/paraphrase", {
			textToParaphrase: text,
		});
		const { aiPrompt } = data;
		return aiPrompt;
	} else {
		alert("Please enter some text");
		return "";
	}
};
export const summarize = async (userText: string) => {
	const text = stripHtmlTags(userText);
	console.log(userText)
	if (text !== "") {
		const { data } = await axios.post("/summarize", {
			textToSummary: text,
		});
		const { aiPrompt } = data;
		return aiPrompt;
	} else {
		alert("Please enter some text");
		return "";
	}
};
export const advanced_check = async function run(text:any) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/edits',
            {
                key: '2J7D6F5JDX3HBH5UJB3CS0UA9W0HZORO',
                session_id: 'test session',
                text,
                advanced_edits: {
                    advanced_edits: true,
                },
            },
        );
        const {status, data} = response;
        console.log({status});
        console.log(JSON.stringify(data, null, 4));
		return data;
    } catch (err:any) {
        const { msg } = err.response.data;
        console.log({err: msg});
		return '';
    }
}

  
