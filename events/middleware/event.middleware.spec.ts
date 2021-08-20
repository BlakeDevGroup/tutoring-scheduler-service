import assert from "assert";
import EventMiddleware from "./event.middleware";

describe("body.validation.middleware", function () {
    describe("#startDateIsLessThanEndDate", function () {
        it("should return true when the value of start_date is less than end_date and false otherwise", function () {
            assert.equal(
                EventMiddleware["startDateIsLessThanEndDate"](
                    "2021-07-29T14:30:00.000Z",
                    "2021-07-29T15:30:00.000Z"
                ),
                true
            );

            assert.equal(
                EventMiddleware["startDateIsLessThanEndDate"](
                    "2021-07-29T15:30:00.000Z",
                    "2021-07-29T14:30:00.000Z"
                ),
                false
            );
        });
    });
});
