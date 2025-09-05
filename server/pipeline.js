// Modular stubbed models and optional Groq-backed orchestration for the story generation pipeline

const ADMIN_KEY = process.env.GROQ_KEY_ADMIN || '';
const CHAR1_KEY = process.env.GROQ_KEY_CHAR1 || process.env.GROQ_KEY_CHAR_1 || '';
const CHAR2_KEY = process.env.GROQ_KEY_CHAR2 || process.env.GROQ_KEY_CHAR_2 || '';
const SUMMARY_KEY = process.env.GROQ_KEY_SUMMARY || process.env.GROQ_KEY_S || '';
const DECIDER_KEY = process.env.GROQ_KEY_DECIDER || process.env.GROQ_KEY_C || '';
const NARRATION_KEY = process.env.GROQ_KEY_NARRATION || process.env.GROQ_KEY_D || '';
const MASTER_KEY = process.env.GROQ_KEY_MASTER || process.env.GROQ_KEY_B || '';
const FAST_MODEL = process.env.GROQ_MODEL_FAST || 'llama-3.1-8b-instant';
const STRONG_MODEL = process.env.GROQ_MODEL_STRONG || 'llama-3.1-8b-instant';

async function groqChat(messages, apiKey, model) {
	if (!apiKey) return null;
	try {
		const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ model, messages, temperature: 0.6 })
		});
		if (!res.ok) return null;
		const json = await res.json();
		return json?.choices?.[0]?.message?.content?.trim?.() || null;
	} catch (_) {
		return null;
	}
}

// Utility to create simple deterministic-looking stubs
function createStub(prefix) {
	let counter = 0;
	return (input) => {
		counter += 1;
		return `${prefix} ${counter}: ${typeof input === 'string' ? input.slice(0, 80) : ''}`.trim();
	};
}

// Stubbed models (replace with real model calls later)
export const refinePrompt = createStub('Refined prompt from Model A');
export async function refinePromptAsync(roughIdea) {
	const content = await groqChat([
		{ role: 'system', content: 'You refine rough story ideas into detailed, concise prompts.' },
		{ role: 'user', content: `Create a detailed story prompt from this rough idea: ${roughIdea}` }
	], ADMIN_KEY, FAST_MODEL);
	return content || refinePrompt(roughIdea);
}
export const generatePhasePlan = (refinedPrompt) => {
	// Very simple fixed plan for demo purposes
	return [
		{ id: 'setup', title: 'Setup', instructions: `Setup based on: ${refinedPrompt.slice(0, 60)}` },
		{ id: 'rising', title: 'Rising Action', instructions: 'Complications arise and tension builds.' },
		{ id: 'climax', title: 'Climax', instructions: 'Critical confrontation or turning point.' },
		{ id: 'resolution', title: 'Resolution', instructions: 'Loose ends resolved and consequences shown.' }
	];
};
export const generateOpeningScene = createStub('Opening scene by Model A');
export async function generateOpeningSceneAsync(refinedPrompt) {
	const content = await groqChat([
		{ role: 'system', content: 'You write short, engaging opening scenes based on prompts.' },
		{ role: 'user', content: `${refinedPrompt}\nWrite an engaging opening scene for the story.` }
	], ADMIN_KEY, FAST_MODEL);
	return content || generateOpeningScene(refinedPrompt);
}
export const modelChar1 = createStub('Char1 response');
export const modelChar2 = createStub('Char2 response');
export async function modelChar1Async(prompt) {
	const content = await groqChat([
		{ role: 'system', content: 'You are Character 1. Reply in character, concise, one paragraph max.' },
		{ role: 'user', content: prompt }
	], CHAR1_KEY || ADMIN_KEY, FAST_MODEL);
	return content || modelChar1(prompt);
}
export async function modelChar2Async(prompt) {
	const content = await groqChat([
		{ role: 'system', content: 'You are Character 2. Reply in character, concise, one paragraph max.' },
		{ role: 'user', content: prompt }
	], CHAR2_KEY || ADMIN_KEY, FAST_MODEL);
	return content || modelChar2(prompt);
}
export const summarizeSegment = createStub('Summary by Model S');
export async function summarizeSegmentAsync(text) {
	const content = await groqChat([
		{ role: 'system', content: 'You summarize recent dialogue into 2-3 bullet sentences.' },
		{ role: 'user', content: text }
	], SUMMARY_KEY || ADMIN_KEY, FAST_MODEL);
	return content || summarizeSegment(text);
}
export const modelCShouldNarrate = (summary) => {
	// Alternate True/False based on simple heuristic for demo
	const hash = summary.length;
	return (hash % 2 === 0) ? 'True' : 'False';
};
export async function modelCShouldNarrateAsync(summary) {
	const content = await groqChat([
		{ role: 'system', content: 'Return only True or False. Decide if narration should be added to engage the reader.' },
		{ role: 'user', content: `Summary: ${summary}\nAnswer strictly True or False.` }
	], DECIDER_KEY || ADMIN_KEY, FAST_MODEL);
	const cleaned = (content || '').trim().toLowerCase();
	if (cleaned === 'true' || cleaned === 'false') return cleaned === 'true' ? 'True' : 'False';
	return modelCShouldNarrate(summary);
}
export const modelDNarration = createStub('Narration by Model D');
export async function modelDNarrationAsync(contextAndSummary) {
	const content = await groqChat([
		{ role: 'system', content: 'Add a brief engaging narration (2-4 sentences) that ties the scene together.' },
		{ role: 'user', content: contextAndSummary }
	], NARRATION_KEY || ADMIN_KEY, FAST_MODEL);
	return content || modelDNarration(contextAndSummary);
}
export const masterSummary = createStub('Master summary by Model B');
export async function masterSummaryAsync(allSummaries) {
	const content = await groqChat([
		{ role: 'system', content: 'Create a comprehensive master summary from segment summaries.' },
		{ role: 'user', content: allSummaries }
	], MASTER_KEY || ADMIN_KEY, STRONG_MODEL);
	return content || masterSummary(allSummaries);
}

// Orchestrator
export function runPipeline(options) {
	const {
		initialRoughIdea,
		confirmedRefinedPrompt,
		confirmedPhasePlan,
		confirmedOpeningScene,
		totalUtterances,
		summaryInterval
	} = options;

	const data = {
		initial_context: confirmedRefinedPrompt,
		phase_plan: confirmedPhasePlan,
		opening_scene: confirmedOpeningScene,
		conversations: [],
		summaries: [],
		narrations: [],
		master_summary: ''
	};

	let currentContext = `${confirmedOpeningScene}`;
	let lastSpeaker = null;

	// First utterance by Char1
	const firstPrompt = `${currentContext}\nWhat does Character1 say first?`;
	const char1Response = modelChar1(firstPrompt);
	data.conversations.push({ speaker: 'Char1', text: char1Response });
	currentContext += `\nChar1: ${char1Response}`;
	lastSpeaker = 'Char1';

	for (let utteranceIndex = 2; utteranceIndex <= totalUtterances; utteranceIndex += 1) {
		const nextSpeaker = lastSpeaker === 'Char1' ? 'Char2' : 'Char1';
		const prompt = `${currentContext}\nHow does ${nextSpeaker} respond?`;
		const response = nextSpeaker === 'Char1' ? modelChar1(prompt) : modelChar2(prompt);
		data.conversations.push({ speaker: nextSpeaker, text: response });
		currentContext += `\n${nextSpeaker}: ${response}`;
		lastSpeaker = nextSpeaker;

		if (utteranceIndex % summaryInterval === 0) {
			const recent = data.conversations.slice(-summaryInterval);
			const recentText = recent.map((r) => `${r.speaker}: ${r.text}`).join('\n');
			const summary = summarizeSegment(`Summarize this segment:\n${recentText}`);
			data.summaries.push(summary);

			const trigger = modelCShouldNarrate(summary).toLowerCase().trim() === 'true';
			if (trigger) {
				const narration = modelDNarration(
					`Context: ${currentContext.slice(0, 200)}\nSummary: ${summary}`
				);
				data.narrations.push(narration);
				currentContext += `\nNarrator: ${narration}`;
			}
		}
	}

	const allSummaries = data.summaries.join('\n');
	data.master_summary = masterSummary(`All summaries:\n${allSummaries}`);

	const mdContent = [
		'# Story Generated',
		'',
		'## Initial Context',
		data.initial_context,
		'',
		'## Opening Scene',
		data.opening_scene,
		'',
		'## Conversations',
		...data.conversations.map((c) => `### ${c.speaker}\n${c.text}\n`),
		'',
		'## Segment Summaries',
		...data.summaries.map((s, i) => `### Summary ${i + 1}\n${s}\n`),
		'',
		'## Narrations',
		...data.narrations.map((n, i) => `### Narration ${i + 1}\n${n}\n`),
		'',
		'## Master Summary',
		data.master_summary,
		''
	].join('\n');

	return { data, markdown: mdContent, meta: { initialRoughIdea } };
}

// Two-step helper for planning
export function createPlan(roughIdea) {
	const refined = refinePrompt(`Create detailed prompt from: ${roughIdea}`);
	const phases = generatePhasePlan(refined);
	const opening = generateOpeningScene(`From refined prompt: ${refined}`);
	return { refinedPrompt: refined, phasePlan: phases, openingScene: opening };
}

// Async versions using Groq if keys exist
export async function runPipelineAsync(options) {
	const {
		initialRoughIdea,
		confirmedRefinedPrompt,
		confirmedPhasePlan,
		confirmedOpeningScene,
		totalUtterances,
		summaryInterval
	} = options;

	const data = {
		initial_context: confirmedRefinedPrompt,
		phase_plan: confirmedPhasePlan,
		opening_scene: confirmedOpeningScene,
		conversations: [],
		summaries: [],
		narrations: [],
		master_summary: ''
	};

	let currentContext = `${confirmedOpeningScene}`;
	let lastSpeaker = null;

	const firstPrompt = `${currentContext}\nWhat does Character1 say first?`;
	const char1Response = await modelChar1Async(firstPrompt);
	data.conversations.push({ speaker: 'Char1', text: char1Response });
	currentContext += `\nChar1: ${char1Response}`;
	lastSpeaker = 'Char1';

	for (let utteranceIndex = 2; utteranceIndex <= totalUtterances; utteranceIndex += 1) {
		const nextSpeaker = lastSpeaker === 'Char1' ? 'Char2' : 'Char1';
		const prompt = `${currentContext}\nHow does ${nextSpeaker} respond?`;
		const response = nextSpeaker === 'Char1' ? await modelChar1Async(prompt) : await modelChar2Async(prompt);
		data.conversations.push({ speaker: nextSpeaker, text: response });
		currentContext += `\n${nextSpeaker}: ${response}`;
		lastSpeaker = nextSpeaker;

		if (utteranceIndex % summaryInterval === 0) {
			const recent = data.conversations.slice(-summaryInterval);
			const recentText = recent.map((r) => `${r.speaker}: ${r.text}`).join('\n');
			const summary = await summarizeSegmentAsync(`Summarize this segment:\n${recentText}`);
			data.summaries.push(summary);

			const decide = await modelCShouldNarrateAsync(summary);
			const trigger = decide.toLowerCase().trim() === 'true';
			if (trigger) {
				const narration = await modelDNarrationAsync(
					`Context: ${currentContext.slice(0, 200)}\nSummary: ${summary}`
				);
				data.narrations.push(narration);
				currentContext += `\nNarrator: ${narration}`;
			}
		}
	}

	const allSummaries = data.summaries.join('\n');
	data.master_summary = await masterSummaryAsync(`All summaries:\n${allSummaries}`);

	const mdContent = [
		'# Story Generated',
		'',
		'## Initial Context',
		data.initial_context,
		'',
		'## Opening Scene',
		data.opening_scene,
		'',
		'## Conversations',
		...data.conversations.map((c) => `### ${c.speaker}\n${c.text}\n`),
		'',
		'## Segment Summaries',
		...data.summaries.map((s, i) => `### Summary ${i + 1}\n${s}\n`),
		'',
		'## Narrations',
		...data.narrations.map((n, i) => `### Narration ${i + 1}\n${n}\n`),
		'',
		'## Master Summary',
		data.master_summary,
		''
	].join('\n');

	return { data, markdown: mdContent, meta: { initialRoughIdea } };
}

export async function createPlanAsync(roughIdea) {
	const refined = await refinePromptAsync(roughIdea);
	const phases = generatePhasePlan(refined);
	const opening = await generateOpeningSceneAsync(refined);
	return { refinedPrompt: refined, phasePlan: phases, openingScene: opening };
}


