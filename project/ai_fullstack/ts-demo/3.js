// ts 是js的超集，把ts当作js来写
function getArea(width, height) {
    return width * height;
}
var area = getArea(20, 5);
console.log(area);
var Status;
(function (Status) {
    Status[Status["pending"] = 0] = "pending";
    Status[Status["success"] = 1] = "success";
    Status[Status["falied"] = 2] = "falied";
})(Status || (Status = {}));
var res = Status.pending;
console.log(res);
