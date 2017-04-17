/**
 * Interface for Racket modules
 */
interface RacketModule {
    definitions():Array<[string,Routine]>;
}

/**
 * Error for Racket routines
 */
class RacketError extends Error {

}