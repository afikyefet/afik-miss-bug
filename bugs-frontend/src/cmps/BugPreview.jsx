

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>{bug.description}</p>
        <h4>{bug.labels.join(', ')}</h4>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}