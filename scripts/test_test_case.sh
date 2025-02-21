# TODO add support of changing iterations from arguments
echo "$1 $2";
alias CMD="CI=1 npx playwright test $2 --workers 4;"
LINE="============="
FAILED=0
PASSED=0

run_test(){
	echo "CI=1 npx playwright test $@ --workers 4"
	CI=1 npx playwright test "$@" --workers 4
	return $?
}
for i in $(seq 1 10); 
	do
		run_test "$@"
		LAST_CODE=$?
		echo -e "$LINE\nLAST_CODE: $LAST_CODE\n$LINE"
		if [ $LAST_CODE -ne 0 ] ; then
			FAILED=$(($FAILED+1));
		else
			PASSED=$(($PASSED+1));
		fi
	echo -e "$LINE\nTOTAL:  $(($PASSED + $FAILED))\nPASSED: $PASSED\nFAILED: $FAILED\n$LINE"
done
CI=0
