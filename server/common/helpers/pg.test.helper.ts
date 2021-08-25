import sinon, { SinonStub } from "sinon";

export type pgPoolStub = {
    connect: SinonStub;
    query: SinonStub;
};

export const poolStub = {
    connect: sinon.stub().returnsThis(),
    query: sinon.stub(),
};

export const pgStub = sinon.stub().callsFake(() => poolStub);

export class PostGresHelperStub {
    private pool: pgPoolStub;

    constructor() {
        this.pool = poolStub;
    }

    query(text: string, params: any) {
        return this.pool.query(text, params);
    }
}
