export default function mapError<T>(f: () => T, onErr: (e?: any) => any): T {
  try {
    return f();
  } catch (err) {
    throw onErr(err);
  }
}
