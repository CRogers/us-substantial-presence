export abstract class Optional<T> {
    public abstract get: () => T;
    public abstract isEmpty: () => boolean;
    public abstract map: <U> (func: (value: T) => U) => Optional<U>;
    public abstract orElse: (otherValue: T) => T;

    public static of<T>(value: T) {
        return new OptionalFull(value);
    }

    public static empty<T>() {
        return new OptionalEmpty<T>();
    }
}

class OptionalFull<T> implements Optional<T> {
    constructor(private readonly value: T) {}

    public get(): T {
        return this.value;
    }

    public isEmpty(): boolean {
        return false;
    }

    public map<U>(func: (value: T) => U): Optional<U> {
        return new OptionalFull(func(this.value));
    }

    public orElse(otherValue: T): T {
        return this.value;
    }
}

class OptionalEmpty<T> implements Optional<T> {
    public get(): T {
        throw new Error("Cannot get from Optional.empty");
    }

    public isEmpty(): boolean {
        return true;
    }

    public map<U>(func: (value: T) => U): Optional<U> {
        return new OptionalEmpty<U>();
    }

    public orElse(otherValue: T): T {
        return otherValue;
    }
}