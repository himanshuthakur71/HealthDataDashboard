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
        this.attributes.splice(index, 1);
    }
}


export const customMetrics = new CustomMetrics();