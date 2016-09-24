export declare class TestElement extends Polymer.Element {
    aNum: number;
    aString: string;
    aBool: boolean;
    lastNumChange: number;
    lastMultiChange: any[];
    numDiv: HTMLDivElement;
    divs: HTMLInputElement[];
    private _aNumChanged(newNum);
    private _numStringChanged(newNum, newString);
}
