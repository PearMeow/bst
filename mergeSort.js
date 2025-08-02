export default function mergeSort(arr = []) {
    if (arr.length === 1) {
        return arr;
    }
    let firstHalf = arr.slice(0, arr.length / 2);
    let secondHalf = arr.slice(arr.length / 2, arr.length);
    let sortedFirst = mergeSort(firstHalf);
    let sortedSecond = mergeSort(secondHalf);
    let firstInd = 0;
    let secondInd = 0;
    let res = [];
    while (firstInd < sortedFirst.length || secondInd < sortedSecond.length) {
        if (firstInd >= sortedFirst.length) {
            res.push(sortedSecond[secondInd]);
            ++secondInd;
        } else if (secondInd >= sortedSecond.length) {
            res.push(sortedFirst[firstInd]);
            ++firstInd;
        } else {
            if (sortedFirst[firstInd] < sortedSecond[secondInd]) {
                res.push(sortedFirst[firstInd]);
                ++firstInd;
            } else {
                res.push(sortedSecond[secondInd]);
                ++secondInd;
            }
        }
    }
    return res;
}
