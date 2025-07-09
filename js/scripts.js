let array = [];
const arrayContainer = document.getElementById('array-container');
const controlsContainer = document.getElementById('controls-container');
let speed = 500;
let sorting = false;

document.getElementById('speedRange').addEventListener('input', function() {
    speed = 1000 - this.value;
});

function generateArray(size = 50) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = `${array[i]}%`;
        bar.classList.add('bar');
        arrayContainer.appendChild(bar);
    }
}

function showDescription(algorithm) {
    const descriptionContainer = document.getElementById('description-container');
    const controls = document.createElement('div');
    controls.classList.add('my-4');

    let description = '';
    let startButton = '';
    let stopButton = '';

    switch (algorithm) {
        case 'bubbleSort':
            description = `
                <h2>Bubble Sort</h2>
                <p>Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.</p>
            `;
            startButton = '<button class="btn btn-success mx-2" onclick="startSorting(bubbleSort)">Start Bubble Sort</button>';
            stopButton = '<button class="btn btn-danger mx-2" onclick="stopSorting()">Stop</button>';
            break;
        case 'insertionSort':
            description = `
                <h2>Insertion Sort</h2>
                <p>Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.</p>
            `;
            startButton = '<button class="btn btn-success mx-2" onclick="startSorting(insertionSort)">Start Insertion Sort</button>';
            stopButton = '<button class="btn btn-danger mx-2" onclick="stopSorting()">Stop</button>';
            break;
        case 'selectionSort':
            description = `
                <h2>Selection Sort</h2>
                <p>Selection Sort is a simple comparison-based sorting algorithm. It works by dividing the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list, and a sublist of the remaining unsorted items that occupy the rest of the list.</p>
            `;
            startButton = '<button class="btn btn-success mx-2" onclick="startSorting(selectionSort)">Start Selection Sort</button>';
            stopButton = '<button class="btn btn-danger mx-2" onclick="stopSorting()">Stop</button>';
            break;
        case 'mergeSort':
            description = `
                <h2>Merge Sort</h2>
                <p>Merge Sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. Most implementations produce a stable sort, meaning that the implementation preserves the input order of equal elements in the sorted output.</p>
            `;
            startButton = '<button class="btn btn-success mx-2" onclick="startSorting(mergeSort)">Start Merge Sort</button>';
            stopButton = '<button class="btn btn-danger mx-2" onclick="stopSorting()">Stop</button>';
            break;
        case 'quickSort':
            description = `
                <h2>Quick Sort</h2>
                <p>Quick Sort is an efficient, in-place sorting algorithm that in practice is faster than MergeSort and HeapSort. However, it is not a stable sorting algorithm, meaning that the relative order of equal sort items is not preserved.</p>
            `;
            startButton = '<button class="btn btn-success mx-2" onclick="startSorting(quickSort)">Start Quick Sort</button>';
            stopButton = '<button class="btn btn-danger mx-2" onclick="stopSorting()">Stop</button>';
            break;
    }

    controls.innerHTML = startButton + stopButton;
    descriptionContainer.innerHTML = description;
    controlsContainer.innerHTML = '';
    controlsContainer.appendChild(controls);
}

async function startSorting(sortFunction) {
    sorting = true;
    await sortFunction();
    sorting = false;
}

function stopSorting() {
    sorting = false;
}

async function bubbleSort() {
    for (let i = 0; i < array.length && sorting; i++) {
        for (let j = 0; j < array.length - i - 1 && sorting; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
}

async function insertionSort() {
    for (let i = 1; i < array.length && sorting; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key && sorting) {
            array[j + 1] = array[j];
            await renderBars(j + 1);
            j--;
        }
        array[j + 1] = key;
        await renderBars(j + 1);
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length - 1 && sorting; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length && sorting; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        await swap(i, minIdx);
    }
}

async function mergeSort() {
    await mergeSortRecursive(array, 0, array.length - 1);
}

async function mergeSortRecursive(arr, left, right) {
    if (left >= right) return;
    const middle = left + Math.floor((right - left) / 2);
    await mergeSortRecursive(arr, left, middle);
    await mergeSortRecursive(arr, middle + 1, right);
    await merge(arr, left, middle, right);
}

async function merge(arr, left, middle, right) {
    const n1 = middle - left + 1;
    const n2 = right - middle;
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);
    for (let i = 0; i < n1; i++) leftArr[i] = arr[left + i];
    for (let i = 0; i < n2; i++) rightArr[i] = arr[middle + 1 + i];
    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        await renderBars(k);
        k++;
    }
    while (i < n1) {
        arr[k] = leftArr[i];
        await renderBars(k);
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = rightArr[j];
        await renderBars(k);
        j++;
        k++;
    }
}

async function quickSort(arr = array, low = 0, high = array.length - 1) {
    if (low < high && sorting) {
        const pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = (low - 1);
    for (let j = low; j <= high - 1 && sorting; j++) {
        if (arr[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }
    await swap(i + 1, high);
    return (i + 1);
}

function swap(i, j) {
    return new Promise(resolve => {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        renderArray();
        setTimeout(() => resolve(), speed);
    });
}

function renderBars(index) {
    return new Promise(resolve => {
        renderArray();
        setTimeout(() => resolve(), speed);
    });
}

generateArray();
