function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function safeRegex(term) {
    const trimmed = String(term || '').trim().slice(0, 100);
    if (!trimmed) return null;
    return { $regex: escapeRegex(trimmed), $options: 'i' };
}

module.exports = { escapeRegex, safeRegex };
