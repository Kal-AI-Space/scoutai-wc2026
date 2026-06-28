import { useState, useEffect, useRef } from "react";

const API_BASE = "https://api.football-data.org/v4";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080c18;
    color: #e8edf8;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1280px;
    margin: 0 auto;
  }

  .header {
    padding: 20px 28px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .brand-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #00d46a22, #00d46a44);
    border: 1px solid #00d46a44;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .brand-text h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }

  .brand-text p {
    font-size: 12px;
    color: #5a6a8a;
    margin-top: 1px;
  }

  .live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,212,106,0.1);
    border: 1px solid rgba(0,212,106,0.25);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    color: #00d46a;
    letter-spacing: 0.5px;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    background: #00d46a;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,212,106,0.6); }
    50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0,212,106,0); }
  }

  .api-key-bar {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .api-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 8px 14px;
    color: #e8edf8;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    width: 280px;
    outline: none;
    transition: border-color 0.2s;
  }

  .api-input:focus { border-color: rgba(0,212,106,0.5); }
  .api-input::placeholder { color: #3a4a6a; }

  .btn {
    background: #00d46a;
    color: #080c18;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .btn:hover { background: #00ef7a; }
  .btn:active { transform: scale(0.97); }
  .btn:disabled { background: #1a2a1a; color: #3a5a3a; cursor: not-allowed; }

  .btn-ghost {
    background: rgba(255,255,255,0.06);
    color: #a8b3cf;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #e8edf8; }

  .main {
    display: flex;
    flex: 1;
    gap: 0;
    overflow: hidden;
  }

  .sidebar {
    width: 300px;
    min-width: 300px;
    border-right: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .sidebar::-webkit-scrollbar { width: 4px; }
  .sidebar::-webkit-scrollbar-track { background: transparent; }
  .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .section {
    padding: 0 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 4px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    color: #3a4a6a;
    text-transform: uppercase;
    margin-bottom: 12px;
    padding-top: 16px;
  }

  .standing-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 13px;
    cursor: default;
  }

  .standing-row:last-child { border-bottom: none; }

  .pos {
    width: 18px;
    font-size: 11px;
    color: #3a4a6a;
    font-weight: 500;
    text-align: center;
    flex-shrink: 0;
  }

  .pos.qualify { color: #00d46a; }
  .pos.third { color: #f5a623; }

  .team-flag {
    width: 20px;
    height: 14px;
    border-radius: 2px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .flag-placeholder {
    width: 20px;
    height: 14px;
    border-radius: 2px;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
  }

  .team-name-st {
    flex: 1;
    font-size: 12px;
    color: #c8d3e8;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .st-pts {
    font-weight: 700;
    font-size: 13px;
    color: #fff;
    width: 20px;
    text-align: right;
  }

  .st-gd {
    font-size: 11px;
    color: #5a6a8a;
    width: 28px;
    text-align: right;
  }

  .match-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .match-card:hover {
    border-color: rgba(0,212,106,0.2);
    background: rgba(0,212,106,0.04);
  }

  .match-status {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .match-status.finished { color: #5a6a8a; }
  .match-status.live { color: #00d46a; }
  .match-status.scheduled { color: #f5a623; }

  .match-teams {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .match-team {
    font-size: 12px;
    font-weight: 600;
    color: #e8edf8;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .match-team.away { text-align: right; }

  .match-score {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    min-width: 48px;
  }

  .match-score.upcoming { font-size: 13px; color: #3a4a6a; }

  .scorer-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 12px;
  }

  .scorer-row:last-child { border-bottom: none; }

  .scorer-rank {
    width: 18px;
    font-size: 11px;
    color: #3a4a6a;
    font-weight: 600;
    text-align: center;
    flex-shrink: 0;
  }

  .scorer-name {
    flex: 1;
    color: #c8d3e8;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .scorer-team {
    font-size: 10px;
    color: #5a6a8a;
  }

  .scorer-goals {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    color: #f5a623;
    font-size: 13px;
  }

  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    padding: 40px 20px;
    gap: 16px;
  }

  .welcome-icon {
    font-size: 56px;
    margin-bottom: 8px;
  }

  .welcome h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .welcome p {
    font-size: 14px;
    color: #5a6a8a;
    max-width: 420px;
    line-height: 1.6;
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 8px;
  }

  .suggestion-chip {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 12px;
    color: #a8b3cf;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .suggestion-chip:hover {
    border-color: rgba(0,212,106,0.3);
    background: rgba(0,212,106,0.06);
    color: #e8edf8;
  }

  .msg {
    display: flex;
    gap: 12px;
    max-width: 820px;
  }

  .msg.user {
    flex-direction: row-reverse;
    align-self: flex-end;
  }

  .msg-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .msg-avatar.ai {
    background: rgba(0,212,106,0.15);
    border: 1px solid rgba(0,212,106,0.2);
  }

  .msg-avatar.user-av {
    background: rgba(245,166,35,0.15);
    border: 1px solid rgba(245,166,35,0.2);
    color: #f5a623;
    font-size: 12px;
    font-weight: 700;
  }

  .msg-bubble {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    border-top-left-radius: 4px;
    padding: 14px 18px;
    font-size: 14px;
    line-height: 1.7;
    color: #d8e3f8;
    max-width: 640px;
  }

  .msg.user .msg-bubble {
    background: rgba(0,212,106,0.08);
    border-color: rgba(0,212,106,0.15);
    border-top-left-radius: 14px;
    border-top-right-radius: 4px;
    color: #e8f8f0;
  }

  .msg-bubble strong { color: #fff; font-weight: 600; }
  .msg-bubble em { color: #00d46a; font-style: normal; font-weight: 500; }

  .typing {
    display: flex;
    gap: 4px;
    padding: 4px 0;
    align-items: center;
  }

  .typing span {
    width: 6px;
    height: 6px;
    background: #00d46a;
    border-radius: 50%;
    animation: bounce 1.2s infinite;
  }

  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(-4px); opacity: 1; }
  }

  .input-bar {
    padding: 16px 28px 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .chat-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 16px;
    color: #e8edf8;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    resize: none;
    outline: none;
    min-height: 48px;
    max-height: 140px;
    line-height: 1.5;
    transition: border-color 0.2s;
  }

  .chat-input:focus { border-color: rgba(0,212,106,0.4); }
  .chat-input::placeholder { color: #3a4a6a; }

  .send-btn {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #00d46a;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.1s;
    color: #080c18;
  }

  .send-btn:hover { background: #00ef7a; }
  .send-btn:active { transform: scale(0.95); }
  .send-btn:disabled { background: #1a2a1a; cursor: not-allowed; color: #3a5a3a; }

  .setup-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 40px 24px;
    text-align: center;
    gap: 24px;
  }

  .setup-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 40px;
    max-width: 480px;
    width: 100%;
  }

  .setup-card h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }

  .setup-card p {
    font-size: 14px;
    color: #5a6a8a;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .setup-steps {
    text-align: left;
    margin-bottom: 24px;
  }

  .setup-step {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 14px;
    font-size: 13px;
    color: #a8b3cf;
    line-height: 1.5;
  }

  .step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0,212,106,0.15);
    border: 1px solid rgba(0,212,106,0.3);
    color: #00d46a;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .setup-input-row {
    display: flex;
    gap: 10px;
  }

  .setup-input-row .api-input {
    flex: 1;
    width: auto;
    padding: 10px 14px;
    font-size: 14px;
  }

  .link {
    color: #00d46a;
    text-decoration: none;
    border-bottom: 1px solid rgba(0,212,106,0.3);
    transition: border-color 0.2s;
  }

  .link:hover { border-color: #00d46a; }

  .error-msg {
    background: rgba(226,75,74,0.1);
    border: 1px solid rgba(226,75,74,0.2);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #f09595;
    margin-top: 12px;
  }

  .data-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #3a4a6a;
    padding: 0 20px;
    padding-bottom: 12px;
  }

  .data-status.ok { color: #00d46a; }

  .group-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 0 20px 12px;
  }

  .group-tab {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px;
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 600;
    color: #5a6a8a;
    cursor: pointer;
    transition: all 0.15s;
  }

  .group-tab.active {
    background: rgba(0,212,106,0.12);
    border-color: rgba(0,212,106,0.3);
    color: #00d46a;
  }

  .attribution {
    padding: 8px 28px;
    font-size: 11px;
    color: #2a3a5a;
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }

  @media (max-width: 768px) {
    .sidebar { display: none; }
    .header { padding: 14px 16px; }
    .api-input { width: 180px; }
    .messages { padding: 16px; }
    .input-bar { padding: 12px 16px 20px; }
    .main { flex-direction: column; }
  }
`;

const SUGGESTIONS = [
  "Who is the current top scorer?",
  "Show me Group A standings",
  "Which teams have qualified so far?",
  "What matches are coming up today?",
  "How has Argentina been performing?",
  "Tell me the biggest upset so far",
];

function formatMatchDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-AU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function shortName(name) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length <= 1) return name;
  return parts[parts.length - 1];
}

function buildContext(data) {
  if (!data) return "";
  let ctx = "FIFA WORLD CUP 2026 — LIVE DATA\n\n";

  if (data.standings?.length > 0) {
    ctx += "GROUP STANDINGS:\n";
    data.standings.forEach(group => {
      ctx += `\n${group.group}:\n`;
      group.table.forEach(row => {
        ctx += `  ${row.position}. ${row.team.name} — P:${row.playedGames} W:${row.won} D:${row.draw} L:${row.lost} GD:${row.goalDifference} Pts:${row.points}\n`;
      });
    });
    ctx += "\n";
  }

  if (data.recentMatches?.length > 0) {
    ctx += "RECENT RESULTS (last 20):\n";
    data.recentMatches.slice(0, 20).forEach(m => {
      ctx += `  ${m.homeTeam.name} ${m.score.fullTime.home ?? "?"} - ${m.score.fullTime.away ?? "?"} ${m.awayTeam.name} (${m.group || "Knockout"}, ${m.stage})\n`;
    });
    ctx += "\n";
  }

  if (data.upcomingMatches?.length > 0) {
    ctx += "UPCOMING MATCHES (next 10):\n";
    data.upcomingMatches.slice(0, 10).forEach(m => {
      ctx += `  ${formatMatchDate(m.utcDate)}: ${m.homeTeam.name} vs ${m.awayTeam.name} (${m.group || m.stage})\n`;
    });
    ctx += "\n";
  }

  if (data.scorers?.length > 0) {
    ctx += "TOP SCORERS:\n";
    data.scorers.slice(0, 10).forEach((s, i) => {
      ctx += `  ${i + 1}. ${s.player.name} (${s.team.name}) — ${s.goals} goals\n`;
    });
  }

  return ctx;
}

export default function FifaChat() {
  const [apiKey, setApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [footballData, setFootballData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadData(key) {
    setDataLoading(true);
    setDataError("");
    try {
      const headers = { "X-Auth-Token": key };
      const [standingsRes, finishedRes, scheduledRes, scorersRes] = await Promise.all([
        fetch(`${API_BASE}/competitions/WC/standings`, { headers }),
        fetch(`${API_BASE}/competitions/WC/matches?status=FINISHED`, { headers }),
        fetch(`${API_BASE}/competitions/WC/matches?status=SCHEDULED`, { headers }),
        fetch(`${API_BASE}/competitions/WC/scorers`, { headers }),
      ]);

      if (!standingsRes.ok) {
        const err = await standingsRes.json();
        throw new Error(err.message || "Invalid API key or data unavailable");
      }

      const [standings, finished, scheduled, scorers] = await Promise.all([
        standingsRes.json(),
        finishedRes.json(),
        scheduledRes.json(),
        scorersRes.json(),
      ]);

      const data = {
        standings: standings.standings || [],
        recentMatches: (finished.matches || []).slice(-30).reverse(),
        upcomingMatches: scheduled.matches || [],
        scorers: scorers.scorers || [],
      };

      setFootballData(data);
      setApiKey(key);
      if (data.standings?.length > 0) {
        setSelectedGroup(data.standings[0].group);
      }
    } catch (e) {
      setDataError(e.message || "Failed to load data. Check your API key.");
    } finally {
      setDataLoading(false);
    }
  }

  async function sendMessage(text) {
    if (!text.trim() || sending) return;
    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const context = buildContext(footballData);
      const systemPrompt = `You are ScoutAI, a FIFA World Cup 2026 expert assistant powered by live tournament data. You have access to real-time standings, results, scorers, and upcoming fixtures.

${context}

Answer questions accurately using the data above. Be concise but insightful. Use specific numbers and stats when relevant. If asked about something not in the data, say so. Format your responses clearly — use line breaks for lists. Today is June 2026.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: text },
          ],
        }),
      });

      const data = await response.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const activeStandings = footballData?.standings?.find(g => g.group === selectedGroup);
  const groups = footballData?.standings?.map(g => g.group) || [];

  if (!apiKey) {
    return (
      <div className="app" style={{ background: "#080c18" }}>
        <style>{styles}</style>
        <div className="header">
          <div className="brand">
            <div className="brand-icon">⚽</div>
            <div className="brand-text">
              <h1>ScoutAI</h1>
              <p>FIFA World Cup 2026 Intelligence</p>
            </div>
          </div>
          <div className="live-badge">
            <div className="live-dot"></div>
            LIVE 2026
          </div>
        </div>
        <div className="setup-screen">
          <div className="setup-card">
            <h2>Connect to live data ⚡</h2>
            <p>ScoutAI uses real-time World Cup 2026 data. Get your free API key from football-data.org in under a minute.</p>
            <div className="setup-steps">
              <div className="setup-step">
                <div className="step-num">1</div>
                <div>Visit <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer" className="link">football-data.org</a> and register for a free account</div>
              </div>
              <div className="setup-step">
                <div className="step-num">2</div>
                <div>Copy your API key from the dashboard (it's free, no credit card needed)</div>
              </div>
              <div className="setup-step">
                <div className="step-num">3</div>
                <div>Paste it below and start asking anything about the tournament</div>
              </div>
            </div>
            <div className="setup-input-row">
              <input
                className="api-input"
                type="password"
                placeholder="Paste your API key here..."
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loadData(apiKeyInput)}
              />
              <button
                className="btn"
                onClick={() => loadData(apiKeyInput)}
                disabled={dataLoading || !apiKeyInput.trim()}
              >
                {dataLoading ? "Loading..." : "Connect"}
              </button>
            </div>
            {dataError && <div className="error-msg">⚠ {dataError}</div>}
          </div>
        </div>
        <div className="attribution">
          Built by Kal Wahid · Powered by Claude AI + football-data.org · <a href="https://www.linkedin.com/in/kareemwahid/" target="_blank" rel="noreferrer" className="link" style={{ fontSize: 11 }}>LinkedIn</a>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ background: "#080c18" }}>
      <style>{styles}</style>
      <div className="header">
        <div className="brand">
          <div className="brand-icon">⚽</div>
          <div className="brand-text">
            <h1>ScoutAI</h1>
            <p>FIFA World Cup 2026 Intelligence</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="live-badge">
            <div className="live-dot"></div>
            LIVE 2026
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { setApiKey(""); setFootballData(null); setMessages([]); }}>
            Reconnect
          </button>
        </div>
      </div>

      <div className="main">
        <div className="sidebar">
          {footballData && (
            <div className="data-status ok">
              ● Data loaded · {footballData.recentMatches?.length || 0} results · {footballData.upcomingMatches?.length || 0} upcoming
            </div>
          )}

          {groups.length > 0 && (
            <div className="section">
              <div className="section-label">Group Standings</div>
              <div className="group-tabs">
                {groups.map(g => (
                  <button key={g} className={`group-tab ${selectedGroup === g ? "active" : ""}`} onClick={() => setSelectedGroup(g)}>
                    {g.replace("Group ", "")}
                  </button>
                ))}
              </div>
              {activeStandings?.table?.map((row, i) => (
                <div key={row.team.id} className="standing-row">
                  <span className={`pos ${i < 2 ? "qualify" : i === 2 ? "third" : ""}`}>{row.position}</span>
                  <div className="flag-placeholder">{row.team.tla?.slice(0, 2)}</div>
                  <span className="team-name-st">{shortName(row.team.name)}</span>
                  <span className="st-gd">{row.goalDifference > 0 ? "+" : ""}{row.goalDifference}</span>
                  <span className="st-pts">{row.points}</span>
                </div>
              ))}
            </div>
          )}

          {footballData?.recentMatches?.length > 0 && (
            <div className="section">
              <div className="section-label">Recent Results</div>
              {footballData.recentMatches.slice(0, 6).map(m => (
                <div key={m.id} className="match-card" onClick={() => sendMessage(`Tell me about the match: ${m.homeTeam.name} vs ${m.awayTeam.name}`)}>
                  <div className="match-status finished">FT · {m.group?.replace("Group ", "Grp ") || m.stage}</div>
                  <div className="match-teams">
                    <span className="match-team">{shortName(m.homeTeam.name)}</span>
                    <span className="match-score">{m.score.fullTime.home} – {m.score.fullTime.away}</span>
                    <span className="match-team away">{shortName(m.awayTeam.name)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {footballData?.upcomingMatches?.length > 0 && (
            <div className="section">
              <div className="section-label">Upcoming</div>
              {footballData.upcomingMatches.slice(0, 4).map(m => (
                <div key={m.id} className="match-card" onClick={() => sendMessage(`Preview the match: ${m.homeTeam.name} vs ${m.awayTeam.name}`)}>
                  <div className="match-status scheduled">{formatMatchDate(m.utcDate)}</div>
                  <div className="match-teams">
                    <span className="match-team">{shortName(m.homeTeam.name)}</span>
                    <span className="match-score upcoming">vs</span>
                    <span className="match-team away">{shortName(m.awayTeam.name)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {footballData?.scorers?.length > 0 && (
            <div className="section">
              <div className="section-label">Top Scorers</div>
              {footballData.scorers.slice(0, 8).map((s, i) => (
                <div key={s.player.id} className="scorer-row">
                  <span className="scorer-rank">{i + 1}</span>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div className="scorer-name">{s.player.name}</div>
                    <div className="scorer-team">{shortName(s.team.name)}</div>
                  </div>
                  <span className="scorer-goals">⚽ {s.goals}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chat-area">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">🏆</div>
                <h2>Ask me anything about World Cup 2026</h2>
                <p>I have live standings, results, top scorers, and upcoming fixtures. Click a match on the left to get instant analysis, or try one of these:</p>
                <div className="suggestions">
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role === "user" ? "user" : ""}`}>
                  <div className={`msg-avatar ${msg.role === "assistant" ? "ai" : "user-av"}`}>
                    {msg.role === "assistant" ? "⚽" : "KW"}
                  </div>
                  <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="msg">
                <div className="msg-avatar ai">⚽</div>
                <div className="msg-bubble">
                  <div className="typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-bar">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about standings, results, players, predictions..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || sending}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div className="attribution">
            Built by <strong style={{ color: "#a8b3cf" }}>Kal Wahid</strong> · Powered by Claude AI + football-data.org ·
            <a href="https://www.linkedin.com/in/kareemwahid/" target="_blank" rel="noreferrer" className="link" style={{ fontSize: 11, marginLeft: 4 }}>LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
