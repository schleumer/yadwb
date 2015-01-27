distfile="yadwb-dist.zip";
prefix="yadwb/";

if [ -f $distfile ]; then
  rm $distfile;
fi

git archive HEAD --prefix=$prefix --format=zip -o $distfile;