export default function formatNumber(num) {  
    if(!Number.isInteger(num)) {
        return num;
    }

    if(num < 1000) {
        return num;
    } 
    
    if(num < 1100) {
        return (num/1000).toFixed(0) + 'k'
    }

    if(num < 100000) {
       return (num/1000).toFixed(1) + 'k'
    }

    if(num < 1000000) {
        return (num/1000).toFixed(0) + 'k'
    } 

    if(num < 1100000) {
        return (num/1000000).toFixed(0) + 'M'
    }

    if(num < 100000000) {
        return (num/1000000).toFixed(1) + 'M'
    } 

    return (num/1000000).toFixed(0) + 'M'
}