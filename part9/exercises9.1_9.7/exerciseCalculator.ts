interface exerCalInput {
    target: number;
    details: Array<number>;
}
  
export const parseArgs = (args: Array<string>): exerCalInput => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const reducer = (accumulator:boolean, currentValue:boolean) => accumulator || currentValue;
  if (!(args.slice(2).map(n => isNaN(Number(n))).reduce(reducer))) {
      if(args.slice(2).map(n => (Number(n)) < 0).reduce(reducer)){
        throw new Error('One or more provided values were smaller than 0!');
      }
      return {
          target: Number(args[2]),
          details: args.slice(3).map(n => Number(n))
      };
  } 
  else {
    throw new Error('One or more provided values were not numbers!');
  }
};

interface exerCalResult {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}
  
export const exerciseCalculator = (details:Array<number>, target: number) : exerCalResult => {
    let rating;
    let ratingDescription;
    if(details.length - 1 <= details.filter(d => d > 0).length){
        rating = 3;
        ratingDescription = 'Very good';
    }
    else if (details.filter(d => d > 0).length < details.length / 2){
        rating = 1;
        ratingDescription = 'Very bad';
    }
    else{
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }
    return {
        periodLength: details.length,
        trainingDays: details.filter(d => d > 0).length,
        success: details.length === details.filter(d => d >= target).length,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: details.reduce((a, b) => a + b, 0) / details.length
    };
};
  
try {
  const { target, details } = parseArgs(process.argv);
  console.log(exerciseCalculator(details, target));
//   console.log(exerciseCalculator([3,0,2,4.5,0,3,1],2));
} 
catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error, something bad happened, message: ', e.message);
}