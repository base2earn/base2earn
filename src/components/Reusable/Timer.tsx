
export default function Timer({ seconds }: { seconds: number }) {
  if (seconds <= 0) {
    return <div className="font-bold">Can burn now!</div>;
  } else return <div className="font-bold">{`Next Burn in ${seconds}s`}</div>;
}
