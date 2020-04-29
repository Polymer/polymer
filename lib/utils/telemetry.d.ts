// tslint:disable:variable-name Describing an API that's defined elsewhere.

export {incrementInstanceCount};

declare function incrementInstanceCount(): void;

export {register};


/**
 * Registers a class prototype for telemetry purposes.
 */
declare function register(prototype: PolymerElementConstructor): void;

export {dumpRegistrations};


/**
 * Logs all elements registered with an `is` to the console.
 */
declare function dumpRegistrations(): void;

import {PolymerElementConstructor} from '../../interfaces';
