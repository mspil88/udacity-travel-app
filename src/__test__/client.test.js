import { reverseDate } from "../client/js/index"

describe("Testing the reverseDate function ", () => {
	test("Expecting dd/mm/yyyy to be reverse to yyyy/mm/dd", () => {
		const dt = "2023/01/01";
		expect(reverseDate("01/01/2023")).toStrictEqual(dt);
	});
});