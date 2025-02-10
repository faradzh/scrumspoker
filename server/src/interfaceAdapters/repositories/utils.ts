export const getSortedSetAsArrayOfObjects = (sortedSet: string[]) => {
   const result = []; 

   for (let i = 0; i < sortedSet.length; i += 2 ) {
       result.push({userId: sortedSet[i], value: sortedSet[i + 1]});
   }

   return result;
}