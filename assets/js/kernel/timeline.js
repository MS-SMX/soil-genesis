window.SG = window.SG || {};

SG.timeline={

    async run(sequence,handlers){

        for(const step of sequence){

            const fn=handlers[step.action];

            if(fn){

                await fn(step);

            }

        }

    }

};