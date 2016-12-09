import { counter } from '../src/counter';

describe('counter', () => {
    it('should increment 0 to 1', () => {
        const res = counter(0, { type: 'INCREMENT' });
        expect(res).to.equal(1);
    });

    it('should increment 1 to 2', () => {
        const res = counter(1, { type: 'INCREMENT' });
        expect(res).to.equal(2);
    });

    it('should decrement 2 to 1', () => {
        const res = counter(2, { type: 'DECREMENT' });
        expect(res).to.equal(1);
    });

    it('should decrement 1 to 0', () => {
        const res = counter(1, { type: 'DECREMENT' });
        expect(res).to.equal(0);
    });

    it('should return the state when not set a valid action type', () => {
        const res = counter(1, { type: 'SOMETHING_HERE' });
        expect(res).to.equal(1);
    });

    it('should have a default initial state', () => {
        const res = counter(undefined, { type: 'INCREMENT' });
        expect(res).to.equal(1);
    });
});