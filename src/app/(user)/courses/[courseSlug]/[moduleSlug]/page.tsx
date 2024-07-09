import ServerModulePage from './ServerModulePage';

export default function Page({ params }: { params: { moduleSlug: string } }) {
  return <ServerModulePage params={params} />;
}