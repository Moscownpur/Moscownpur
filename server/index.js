import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createPlan, runPipeline, createPlanAsync, runPipelineAsync } from './pipeline.js';

const app = express();
const PORT = process.env.PORT || 5175;

app.use(cors());
app.use(bodyParser.json());

// Step A: plan endpoint (optional, can also be part of /generate-story)
app.post('/api/plan', async (req, res) => {
	try {
		const { roughIdea } = req.body || {};
		if (!roughIdea) {
			return res.status(400).json({ error: 'roughIdea is required' });
		}
		const useGroq = Boolean(process.env.GROQ_KEY_ADMIN || process.env.GROQ_KEY_CHAR1 || process.env.GROQ_KEY_CHAR2);
		const plan = useGroq ? await createPlanAsync(roughIdea) : createPlan(roughIdea);
		return res.json({ ok: true, plan });
	} catch (err) {
		return res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
	}
});

// Step B: full generation after confirmation
app.post('/api/generate-story', async (req, res) => {
	try {
		const {
			roughIdea,
			refinedPrompt,
			phasePlan,
			openingScene,
			totalUtterances = 12,
			summaryInterval = 4
		} = req.body || {};

		if (!refinedPrompt || !phasePlan || !openingScene) {
			return res.status(400).json({
				error: 'refinedPrompt, phasePlan, and openingScene are required (confirm the plan first)'
			});
		}

		const useGroq = Boolean(process.env.GROQ_KEY_ADMIN || process.env.GROQ_KEY_CHAR1 || process.env.GROQ_KEY_CHAR2);
		const result = useGroq
			? await runPipelineAsync({
				initialRoughIdea: roughIdea,
				confirmedRefinedPrompt: refinedPrompt,
				confirmedPhasePlan: phasePlan,
				confirmedOpeningScene: openingScene,
				totalUtterances: Number(totalUtterances),
				summaryInterval: Number(summaryInterval)
			})
			: runPipeline({
				initialRoughIdea: roughIdea,
				confirmedRefinedPrompt: refinedPrompt,
				confirmedPhasePlan: phasePlan,
				confirmedOpeningScene: openingScene,
				totalUtterances: Number(totalUtterances),
				summaryInterval: Number(summaryInterval)
			});

		return res.json({ ok: true, ...result });
	} catch (err) {
		return res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
	}
});

app.get('/api/health', (_req, res) => {
	res.json({ ok: true });
});

app.listen(PORT, () => {
	console.log(`Pipeline demo server listening on http://localhost:${PORT}`);
});


