/**
 * TodoListPage — Screen Vault page for the Todo List app.
 * Timeline/Chronological layout (Sketch proposal #7).
 */

import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import TodoList from '../TodoList';

export default function TodoListPage() {
  return (
    <ScreenVaultFrame
      title="Todo List"
      description="A timeline-based task manager grouping todos by date. Editorial F-pattern with vertical spine, search, filters, and inline task metadata."
      standaloneId="todo-list"
      frameHeight={860}
    >
      <TodoList />
    </ScreenVaultFrame>
  );
}
