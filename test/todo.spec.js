import { todos } from '../src/todo';

describe.only('Todos', () => {
    describe('Add Todos', () => {
        it('should add a new todo', () => {
            const stateBefore = [];
            const action = {
                type: 'ADD_TODO',
                id: 0,
                text: 'Learn Redux'
            };
            const stateAfter = [
                {
                    id: 0,
                    text: 'Learn Redux',
                    completed: false
                }
            ];
            expect(todos(stateBefore, action)).to.deep.equal(stateAfter);
        });
    });

    describe('Toggle Todo', () => {
        it('should toggle the right todo', () => {
            const stateBefore = [
                {
                    id: 0,
                    text: 'Learn Redux',
                    completed: false
                },
                {
                    id: 1,
                    text: 'Go shopping',
                    completed: false
                }
            ];
            const action = {
                type: 'TOGGLE_TODO',
                id: 1
            };
            const stateAfter = [
                {
                    id: 0,
                    text: 'Learn Redux',
                    completed: false
                },
                {
                    id: 1,
                    text: 'Go shopping',
                    completed: true
                }
            ];
            expect(todos(stateBefore, action)).to.deep.equal(stateAfter);
        });
    });
});