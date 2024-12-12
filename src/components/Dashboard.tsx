import { TaskCard } from "./TaskCard";

export function Dashboard() {
  const tasks = [
    {
      title: "Complete Project Proposal",
      duration: "2 hours",
      priority: "High" as const,
      completed: false,
    },
    {
      title: "Review Documentation",
      duration: "1 hour",
      priority: "Medium" as const,
      completed: true,
    },
    {
      title: "Team Meeting",
      duration: "30 minutes",
      priority: "Low" as const,
      completed: false,
    },
  ];

  return (
    <div className="container mx-auto p-6 page-transition">
      <h1 className="mb-8 text-4xl font-bold">TaskTimer+</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  );
}