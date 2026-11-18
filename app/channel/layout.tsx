import { appStore } from "@/lib/app.store";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  appStore.set('darkMode', false);
  return (
    <>
      {children}
    </>
  );
}
