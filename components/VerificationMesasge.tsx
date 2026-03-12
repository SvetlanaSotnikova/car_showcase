interface Props {
  email?: string;
}

export default function VerificationMessage({ email }: Props) {
  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow-md space-y-4 text-center">
          <div className="text-5xl">📬</div>
          <h1 className="text-2xl font-bold">Check your inbox!</h1>
          <p className="text-gray-500">
            We sent a verification email to <strong>{email}</strong>.
            <br />
            Click the link and you'll be logged in automatically.
          </p>
          <p className="text-xs text-gray-400 animate-pulse">
            Waiting for verification...
          </p>
          <p className="text-xs text-gray-400">
            I WON'T STEAL YOUR DATA!! come on :)
          </p>
        </div>
      </div>
    </section>
  );
}