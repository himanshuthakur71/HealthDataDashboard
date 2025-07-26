class CustomMetrics {
    attributes: any[] = $state([]);

    add(value: any) {
        this.attributes.push(value)
    }

    update(value: any) {
        this.attributes = value
    }

    updateIndex(index: number, value: any) {
        this.attributes[index] = value
    }

    delete(index: number) {
        let tempArray = this.attributes
        tempArray.splice(index, 1);
        // console.log(tempArray)
        this.attributes = tempArray
    }
}


export const customMetrics = new CustomMetrics();