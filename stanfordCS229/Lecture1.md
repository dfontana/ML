## Definition:
- Arthur Samuel (1959): Field of study that gives computers the ability to learn without being explicitly programmed.
- Tom Mitchell (1998): A computer program is said to *learn* from experience E with respect tosome task T and some performance measure P if it's performance on T as measured by P improves experience E.

## Supervised Learning:
- Housing prices examples. You can get a set of data that matches house prices to area sizes in Portland Oregon.
    - I want an algorithm to tell me how much my house will sell based on that data.
    - Supervised learning takes this provided data set and learns how to best fit that data so it can extrapolate on it. We are *supervising* the algorithm by "giving it the right answers"
    - This example happens to be a *regression* problem where you are trying to learn the best fit.
    - In other examples, like *classification* problems, you are trying to classify inputted data into a certain output. The output is discrete values.

## Unsupervised Learning
- Given a dataset, you don't have the right answer. You are asking the algorithm to find structure in the data and make something out of it.
- Social network analysis, marketing segmentation, astronomical data analysis all are good applications for this.
- Cocktail party problem: 
    - There are a lot of people talking at a party.
    - Can you sperate the voice of the person you are trying to listen to? (lets say it was recorded by two microphones slightly near each of two speakers so one is more pronounced in one recording compared to the second).
    - An algorithm,*independent component analysis* can solve this problem. This applies to many other cases too.
    - Sounds complicated, right? Wrong. It's one line in MatLab. Not easy, but not complicated.

## Reinforcement Learning
- Make a decision and then reinforce with a consequence.
- Key idea: *reward function.* Think of it as a "good dog, bad dog thing."
- Specify what makes a good and bad dog, and leave it to the algorithm to figure
 out how to optimize them.

