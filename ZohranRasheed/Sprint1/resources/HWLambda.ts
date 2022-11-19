exports.HW_Lambda=async function(event: any, context: any )
{
    return `Hellow From ${event.firstName}`;
}