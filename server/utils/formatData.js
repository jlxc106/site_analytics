var formatData = (data) =>{
    try{
        var formattedData = data;
        const currentYear = new Date().getFullYear();
        formattedData.status = parseInt(data.status);
        formattedData.size = parseInt(data.size);
        var year = new Date().getFullYear();
        formattedData['access date'] = new Date(data['access date'].replace(`${year}:`, `${year} `));
        return formattedData;
    }catch(e){
        return e;
    }

}

module.exports = {formatData};