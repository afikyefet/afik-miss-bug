

export function UserPreview({ user }) {

    return <article >
        <h1>{user.username}</h1>
        <p>{user.fullname}</p>
        <p>Score: <span>{user.score}</span></p>
    </article>
}