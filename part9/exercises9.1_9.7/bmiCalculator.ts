interface BMIValues {
    value1: number;
    value2: number;
}
  
const parseArguments = (args: Array<string>): BMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } 
  else {
    throw new Error('Provided values were not numbers!');
  }
}

type BMIResult = string;
  
const bmiCalculator = (height: number, mass: number) : BMIResult => {
  if (height <=0 || mass <= 0){
      throw new Error('wrong input of height or mass');
  }
  const bmi = (100 * 100 * mass) / (height * height)
  if(bmi < 16){
      return 'Underweight (Severe thinness)';
  }
  else if(bmi < 17){
      return 'Underweight (Moderate thinness)';
  }
  else if(bmi < 18.5){
      return 'Underweight (Mild thinness)';
  }
  else if(bmi < 25){
      return 'Normal (healthy weight)';
  }
  else if(bmi < 30){
      return 'Overweight (Pre-obese)';
  }
  else if(bmi < 35){
      return 'Obese (Class I)';
  }
  else if(bmi < 40){
      return 'Obese (Class II)';
  }
  else{
      return 'Obese (Class III)';
  }
}
  
try {
  const { value1, value2 } = parseArguments(process.argv);
  // console.log(bmiCalculator(180, 74));
  console.log(bmiCalculator(value1, value2));
} 
catch (e) {
  console.log('Error, something bad happened, message: ', e.message);
}

export default bmiCalculator