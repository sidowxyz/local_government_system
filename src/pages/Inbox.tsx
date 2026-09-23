import { useMemo, useState } from 'react';
import { InboxIcon } from '../components/icons';
import { UnderlineTabs, type TabItem } from '../components/UnderlineTabs';
import { Button } from '../components/Button';
import { inboxTasks } from '../data/tasks';
import { useScreenInit } from '../useScreenInit.js';

const emptyCopy: Record<string, string> = {
  mine: 'Work assigned to you or to your office will appear here.',
  office:
  'Unclaimed work for this office will appear here as soon as a case reaches a step your office owns.',
  internal:
  'Cases raised inside the office, rather than by a citizen, will appear here.'
};

const headerClasses =
'px-5 py-3 text-meta font-medium uppercase tracking-[0.06em] text-muted';

export function Inbox() {
  const screenInit = useScreenInit();
  const [queue, setQueue] = useState<string>(screenInit.tab ?? 'mine');

  const tasks = useMemo(
    () => inboxTasks.filter((task) => task.queue === queue),
    [queue]
  );

  const tabs: TabItem[] = [
  {
    id: 'mine',
    label: 'My tasks',
    count: inboxTasks.filter((task) => task.queue === 'mine').length
  },
  {
    id: 'office',
    label: 'Office queue',
    count: inboxTasks.filter((task) => task.queue === 'office').length
  },
  {
    id: 'internal',
    label: 'Internal cases',
    count: inboxTasks.filter((task) => task.queue === 'internal').length
  }];


  const hasTasks = tasks.length > 0;

  return (
    <section
      aria-labelledby="inbox-heading"
      className="flex min-h-0 flex-1 flex-col">
      
      <div className="flex min-h-0 max-h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card">
        <div className="shrink-0 border-b border-hairline bg-white px-6 py-5">
          <h1 id="inbox-heading" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Inbox
          </h1>
        </div>

        <div className="shrink-0">
          <UnderlineTabs
            items={tabs}
            value={queue}
            onChange={setQueue}
            label="Inbox queues" />
          
        </div>

        {hasTasks ?
        <>
            <div className="min-h-0 max-h-full overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Tasks waiting in this queue</caption>
                <thead className="sticky top-0 z-10 border-b border-hairline bg-surface/60 backdrop-blur-sm">
                  <tr className="border-b border-hairline">
                    <th scope="col" className={headerClasses}>
                      Task
                    </th>
                    <th scope="col" className={`${headerClasses} w-[250px]`}>
                      Reference
                    </th>
                    <th scope="col" className={`${headerClasses} w-[170px]`}>
                      Applicant
                    </th>
                    <th scope="col" className={`${headerClasses} w-[130px]`}>
                      Waiting
                    </th>
                    <th scope="col" className={`${headerClasses} w-[120px]`}>
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {tasks.map((task) =>
                <tr
                  key={task.id}
                  className="transition-colors duration-150 ease-standard hover:bg-surface">
                  
                      <td className="px-5 py-3.5">
                        <span className="block text-body font-semibold text-ink">
                          {task.step}
                        </span>
                        <span className="mt-0.5 block text-meta text-muted">
                          {task.serviceName}
                        </span>
                      </td>
                      <td className="w-[250px] break-all px-5 py-3.5 font-mono text-meta text-primary/70">
                        {task.reference}
                      </td>
                      <td className="px-5 py-3.5 text-body text-ink">
                        {task.applicant}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="block text-body text-ink">
                          {task.waitingDays === 1 ?
                      '1 day' :
                      `${task.waitingDays} days`}
                        </span>
                        <span
                      className={[
                      'mt-0.5 block text-meta',
                      task.dueLabel === 'Overdue' ?
                      'text-danger' :
                      'text-muted'].
                      join(' ')}>
                      
                          {task.dueLabel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button variant="secondary">Claim</Button>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            <div className="shrink-0 border-t border-hairline px-5 py-3 text-right text-meta text-muted">
              Showing 1–{tasks.length} of {tasks.length}
            </div>
          </> :

        <div className="px-5 py-12 text-center">
            <InboxIcon className="mx-auto h-6 w-6 text-muted" strokeWidth={1.5} />
            <p className="mt-3 text-body font-semibold text-ink">
              Nothing waiting
            </p>
            <p className="mx-auto mt-1 max-w-md text-body text-muted">
              {emptyCopy[queue] ?? emptyCopy.mine}
            </p>
          </div>
        }
      </div>
    </section>);

}